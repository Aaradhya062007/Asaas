import io
import qrcode
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image as RLImage
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import inch

def generate_pdf_ticket(booking):
    """
    Generates a professional PDF movie ticket with embedded QR code.
    Returns PDF bytes.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    story = []
    styles = getSampleStyleSheet()

    # Title style
    title_style = ParagraphStyle(
        'TicketTitle',
        parent=styles['Heading1'],
        fontSize=24,
        leading=28,
        textColor=colors.HexColor("#DC2626"), # Red theme
        alignment=1, # Center
        spaceAfter=15
    )

    header_style = ParagraphStyle(
        'TicketHeader',
        parent=styles['Heading2'],
        fontSize=16,
        leading=20,
        textColor=colors.HexColor("#1F2937"),
        spaceAfter=6
    )

    label_style = ParagraphStyle(
        'TicketLabel',
        parent=styles['Normal'],
        fontSize=10,
        leading=12,
        textColor=colors.HexColor("#6B7280"),
    )

    value_style = ParagraphStyle(
        'TicketValue',
        parent=styles['Normal'],
        fontSize=11,
        leading=14,
        textColor=colors.HexColor("#111827"),
        fontName="Helvetica-Bold"
    )

    # 1. Header
    story.append(Paragraph("BOOKMYSEAT - E-TICKET", title_style))
    story.append(Spacer(1, 10))

    # 2. QR Code Generation
    qr_data = f"BOOKING:{booking.booking_id}|USER:{booking.user.username}|MOVIE:{booking.show_schedule.movie.title}"
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=4,
        border=2,
    )
    qr.add_data(qr_data)
    qr.make(fit=True)
    img_buffer = io.BytesIO()
    qr_img = qr.make_image(fill_color="black", back_color="white")
    qr_img.save(img_buffer, format="PNG")
    img_buffer.seek(0)

    qr_code_image = RLImage(img_buffer, width=1.5*inch, height=1.5*inch)

    # Seat Labels list
    booked_seats_list = [f"{bs.seat.row_label}{bs.seat.number}" for bs in booking.booked_seats.all()]
    seats_str = ", ".join(booked_seats_list) if booked_seats_list else "Standard"

    # Ticket info grid data
    movie = booking.show_schedule.movie
    theater = booking.show_schedule.screen.theater
    screen = booking.show_schedule.screen
    start_time = booking.show_schedule.start_time.strftime("%A, %B %d, %Y at %I:%M %p")

    info_data = [
        [
            Paragraph("<b>Movie Title:</b>", label_style),
            Paragraph(movie.title, value_style),
            qr_code_image
        ],
        [
            Paragraph("<b>Booking ID:</b>", label_style),
            Paragraph(booking.booking_id, value_style),
            Paragraph("<b>Scan QR for verification</b>", label_style)
        ],
        [
            Paragraph("<b>Theater:</b>", label_style),
            Paragraph(f"{theater.name}, {theater.city.name}", value_style),
            ""
        ],
        [
            Paragraph("<b>Screen:</b>", label_style),
            Paragraph(screen.name, value_style),
            ""
        ],
        [
            Paragraph("<b>Showtime:</b>", label_style),
            Paragraph(start_time, value_style),
            ""
        ],
        [
            Paragraph("<b>Booked Seats:</b>", label_style),
            Paragraph(seats_str, value_style),
            ""
        ],
        [
            Paragraph("<b>Total Amount:</b>", label_style),
            Paragraph(f"Rs. {booking.total_amount:.2f}", value_style),
            ""
        ],
        [
            Paragraph("<b>Payment Status:</b>", label_style),
            Paragraph(f"<font color='#DC2626'><b>{booking.payment_status}</b></font>", value_style),
            ""
        ]
    ]

    t = Table(info_data, colWidths=[1.5*inch, 3.5*inch, 2.0*inch])
    t.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('SPAN', (2, 0), (2, 1)), # QR Code spans 2 rows
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('LINEBELOW', (0, -1), (-1, -1), 1, colors.HexColor("#E5E7EB")),
    ]))

    story.append(t)
    story.append(Spacer(1, 20))
    story.append(Paragraph("<i>Thank you for booking with BookMySeat! Please present this PDF ticket at the venue entry.</i>", label_style))

    doc.build(story)
    buffer.seek(0)
    return buffer.getvalue()
